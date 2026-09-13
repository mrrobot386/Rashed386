/**
 * Task Executor for ANISA AI ULTRA
 * Executes multi-step plans sequentially, verifying each step before proceeding.
 * Halts immediately if an intermediate step fails or if confirmation is awaited.
 */

import { MultiStepPlan } from '../types/tools';
import { ToolDispatcher } from '../live/toolDispatcher';

export interface ExecutionProgress {
  planId: string;
  currentStep: number;
  totalSteps: number;
  stepName: string;
  status: 'running' | 'waiting_confirmation' | 'completed' | 'failed';
  message: string;
}

export class TaskExecutor {
  /**
   * Executes a plan step by step with verification and error halting.
   */
  static async execute(
    plan: MultiStepPlan,
    onProgress?: (progress: ExecutionProgress) => void,
    userConfirmed = false
  ): Promise<{ success: boolean; results: Record<string, unknown>[]; error?: string }> {
    const results: Record<string, unknown>[] = [];
    plan.status = 'executing';

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      plan.currentStepIndex = i;

      // 1. Check if user confirmation is needed
      if (step.requiresConfirmation && !userConfirmed) {
        plan.status = 'waiting_confirmation';
        plan.pendingConfirmationStep = step;
        onProgress?.({
          planId: plan.planId,
          currentStep: i + 1,
          totalSteps: plan.steps.length,
          stepName: step.toolName,
          status: 'waiting_confirmation',
          message: `Voice confirmation required for step: ${step.toolName}`,
        });
        return {
          success: false,
          results,
          error: `Step ${step.stepId} requires user confirmation.`,
        };
      }

      // 2. Report progress
      step.status = 'in_progress';
      onProgress?.({
        planId: plan.planId,
        currentStep: i + 1,
        totalSteps: plan.steps.length,
        stepName: step.toolName,
        status: 'running',
        message: `Executing ${step.toolName}...`,
      });

      // 3. Dispatch tool execution
      try {
        const response = await ToolDispatcher.dispatch({
          id: `step_${step.stepId}`,
          name: step.toolName,
          args: { ...step.args, action: step.action, user_confirmed: userConfirmed },
        });

        if (response.response.success) {
          step.status = 'completed';
          step.result = response.response;
          results.push(response.response);
        } else {
          step.status = 'failed';
          step.error = response.response.error || 'Step execution failed';
          plan.status = 'failed';
          onProgress?.({
            planId: plan.planId,
            currentStep: i + 1,
            totalSteps: plan.steps.length,
            stepName: step.toolName,
            status: 'failed',
            message: `Step failed: ${step.error}`,
          });
          return {
            success: false,
            results,
            error: `Plan halted at step ${step.stepId} (${step.toolName}): ${step.error}`,
          };
        }
      } catch (err: unknown) {
        step.status = 'failed';
        const msg = String(err || 'Unexpected error executing step');
        step.error = msg;
        plan.status = 'failed';
        return {
          success: false,
          results,
          error: `Execution failure in ${step.toolName}: ${msg}`,
        };
      }
    }

    plan.status = 'completed';
    onProgress?.({
      planId: plan.planId,
      currentStep: plan.steps.length,
      totalSteps: plan.steps.length,
      stepName: 'complete',
      status: 'completed',
      message: 'All plan steps completed successfully.',
    });

    return { success: true, results };
  }
}
