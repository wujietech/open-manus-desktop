/*
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  Message,
  GUIAgentData,
  PredictionParsed,
  ScreenshotResult,
} from '@ui-tars/shared/types';

import { BaseOperator, BaseModel } from './base';
import { UITarsModel } from './Model';
export interface ExecuteParams {
  prediction: string;
  parsedPrediction: PredictionParsed;
  /** Device Physical Resolution */
  screenWidth: number;
  /** Device Physical Resolution */
  screenHeight: number;
  /** Device DPR */
  scaleFactor: number;
}

export interface ScreenshotOutput extends ScreenshotResult {}

export interface InvokeParams {
  conversations: Message[];
  images: string[];
}

export interface InvokeOutput {
  prediction: string;
  parsedPredictions: PredictionParsed[];
}
export abstract class Operator<T = unknown> extends BaseOperator<T> {
  constructor(config?: T) {
    super(config);
  }
  abstract screenshot(): Promise<ScreenshotOutput>;
  abstract execute(params: ExecuteParams): Promise<void>;
}

export abstract class Model<T = unknown> extends BaseModel<T> {
  abstract invoke(params: InvokeParams): Promise<InvokeOutput>;
}

export type Logger = Pick<Console, 'log' | 'error' | 'warn' | 'info'>;

export interface RetryConfig {
  maxRetries: number;
  onRetry?: (error: Error, attempt: number) => void;
}

export interface GUIAgentError {
  // TODO: define error code
  code: number;
  error: string;
  stack?: string;
}

export interface GUIAgentConfig<TOperator> {
  operator: TOperator;
  model: ConstructorParameters<typeof UITarsModel>[0];

  // ===== Optional =====
  systemPrompt?: string;
  signal?: AbortSignal;
  onData?: (params: { data: GUIAgentData }) => void;
  onError?: (params: { data: GUIAgentData; error: GUIAgentError }) => void;
  logger?: Logger;
  retry?: {
    model?: RetryConfig;
    screenshot?: RetryConfig;
    execute?: RetryConfig;
  };
}

export interface AgentConfig extends GUIAgentConfig<Operator> {
  logger: NonNullable<GUIAgentConfig<Operator>['logger']>;
  factor: number;
}
