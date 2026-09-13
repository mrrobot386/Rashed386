/**
 * Task Planner for ANISA AI ULTRA
 * Creates ordered step sequences with permission validation and safe stop criteria.
 */

import { MultiStepPlan, TaskStep, PermissionLevel } from '../types/tools';

export class TaskPlanner {
  /**
   * Builds an executable plan with permission requirements and verification rules.
   */
  static buildPlan(
    objective: string,
    rawSteps: Array<{
      toolName: string;
      action: string;
      args: Record<string, unknown>;
      permissionLevel?: PermissionLevel;
    }>
  ): MultiStepPlan {
    let requiresConfirmation = false;
    let pendingConfirmationStep: TaskStep | undefined;

    const steps: TaskStep[] = rawSteps.map((step, index) => {
      const isDangerous =
        step.toolName === 'sendMessage' ||
        (step.toolName === 'fileOperation' && (step.action === 'delete' || step.action === 'move')) ||
        (step.toolName === 'closeApplication' && Boolean(step.args.force)) ||
        step.toolName === 'terminateProcess';

      const permLevel: PermissionLevel = isDangerous ? 'CONFIRMATION_REQUIRED' : 'SAFE';

      const taskStep: TaskStep = {
        stepId: index + 1,
        toolName: step.toolName,
        action: step.action,
        args: step.args,
        permissionLevel: permLevel,
        requiresConfirmation: isDangerous,
        status: 'pending',
      };

      if (isDangerous && !pendingConfirmationStep) {
        requiresConfirmation = true;
        pendingConfirmationStep = taskStep;
      }

      return taskStep;
    });

    return {
      planId: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      objective,
      steps,
      currentStepIndex: 0,
      status: 'ready',
      requiresConfirmation,
      pendingConfirmationStep,
    };
  }
}
