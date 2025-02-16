/*
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
import OpenAI, { type ClientOptions } from 'openai';
import { actionParser } from '@ui-tars/action-parser';

import { useConfig } from './context/useConfig';
import { Model, type InvokeParams, type InvokeOutput } from './types';

import { preprocessResizeImage, convertToOpenAIMessages } from './utils';
import { FACTOR, MAX_PIXELS } from './constants';

export interface UITarsModelConfig extends ClientOptions {
  /** ID of the model to use */
  model: string;
}

export class UITarsModel extends Model<UITarsModelConfig> {
  private readonly modelConfig: UITarsModelConfig;
  constructor(modelConfig: UITarsModelConfig) {
    super(modelConfig);
    this.modelConfig = modelConfig;
  }

  get factor(): number {
    return FACTOR;
  }

  async invoke(params: InvokeParams): Promise<InvokeOutput> {
    const { logger, signal } = useConfig();
    const { baseURL, apiKey, model, ...restOptions } = this.modelConfig;
    const { conversations, images } = params;

    const compressedImages = await Promise.all(
      images.map((image) => preprocessResizeImage(image, MAX_PIXELS)),
    );

    const messages = convertToOpenAIMessages({
      conversations,
      images: compressedImages,
    });

    const openai = new OpenAI({
      ...restOptions,
      baseURL,
      apiKey,
    });

    const startTime = Date.now();
    const result = await openai.chat.completions
      .create(
        {
          model,
          messages,
          // TODO: more custom options
          max_tokens: 1000,
          stream: false,
          temperature: 0,
          top_p: 0.7,
          seed: null,
          stop: null,
          frequency_penalty: null,
          presence_penalty: null,
        },
        {
          signal,
        },
      )
      .finally(() => {
        logger?.info(`[vlm_invoke_time_cost]: ${Date.now() - startTime}ms`);
      });
    if (!result.choices[0].message.content) {
      const err = new Error();
      err.name = 'vlm response error';
      err.stack = JSON.stringify(result) ?? 'no message';
      logger?.error(err);
      throw err;
    }

    const prediction = result.choices[0].message.content;

    const data = {
      prediction,
      factor: FACTOR,
    };
    try {
      const { parsed: parsedPredictions } = await actionParser(data);
      return {
        prediction,
        parsedPredictions,
      };
    } catch (error) {
      logger?.error('[UITarsModel] error', error);
      return {
        prediction,
        parsedPredictions: [],
      };
    }
  }
}
