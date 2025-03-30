import axios from 'axios';
import config from '@/config/config';
import { DataForSEOOnPagePagesResponse, DataForSEOTaskResult } from '../types/advancedReport';

const credentials = btoa(`${config.dataForSeoLogin}:${config.dataForSeoPassword}`);

// FREE REPORT

/**
 * Crea una tarea de SEO en la API de DataForSEO.
 * @param targetUrl URL a analizar
 * @returns taskId de la tarea creada
 */
export const createSeoTask = async (targetUrl: string): Promise<string> => {
  try {
    console.log({ config });
    console.log({ credentials });
    const response = await axios.post(
      'https://api.dataforseo.com/v3/on_page/task_post',
      [
        {
          target: targetUrl,
          max_crawl_pages: 10,
          load_resources: true,
          enable_javascript: true,
        },
      ],
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.data?.status_code !== 20000) {
      throw new Error('Failed to create task: ' + response.data?.status_message);
    }

    const taskId = response.data?.tasks?.[0]?.id;
    if (!taskId) {
      throw new Error('No task ID received');
    }

    return taskId;
  } catch (err) {
    console.error('Task creation error:', err);
    throw new Error('Failed to create SEO analysis task');
  }
};

/**
 * Verifica el estado de la tarea en DataForSEO.
 * @param taskId ID de la tarea
 * @returns Datos del resultado de la verificación o null si no está listo
 */
export const checkSeoTaskStatus = async (taskId: string): Promise<any> => {
  try {
    const response = await axios.get(`https://api.dataforseo.com/v3/on_page/summary/${taskId}`, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.status_code !== 20000) {
      throw new Error('Failed to check task: ' + response.data?.status_message);
    }

    const result = response.data?.tasks?.[0]?.result?.[0];
    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.error('Task status check error:', err);
    throw new Error('Failed to check task progress');
  }
};

/**
 * Revisa periódicamente el estado de la tarea hasta que finalice o alcance el máximo de intentos.
 * @param taskId ID de la tarea
 * @param totalPages Número máximo de páginas a rastrear
 * @param setProgress Función para actualizar el progreso local
 * @param setPagesChecked Función para actualizar el número de páginas rastreadas
 * @param setPercentage Función global (store o contexto) para actualizar el porcentaje
 * @returns Resultado final de la tarea de SEO
 */
export const pollSeoTaskStatus = async (
  taskId: string,
  totalPages: number,
  setProgress: (val: number) => void,
  setPagesChecked: (val: number) => void,
  setPercentage: (val: number) => void,
): Promise<any> => {
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    const result = await checkSeoTaskStatus(taskId);

    if (result) {
      const { crawl_progress, crawl_status } = result;

      if (crawl_status) {
        const { pages_crawled = 0 } = crawl_status;
        setPagesChecked(pages_crawled);
        setProgress((pages_crawled / totalPages) * 100);
        setPercentage((pages_crawled / totalPages) * 100);
      }

      if (crawl_progress === 'finished' || (crawl_status?.pages_crawled || 0) >= totalPages) {
        return result;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, config.dataForSeoPollInterval));
    attempts++;
  }

  throw new Error('Task timed out. Please try again.');
};

// ADVANCED REPORT
/**
 * Crea una tarea de SEO en la API de DataForSEO.
 * @param targetUrl URL a analizar
 * @returns taskId de la tarea creada
 */
export const createPagesTask = async (
  targetUrl: string,
  maxCrawlPages: number = 1000,
): Promise<string> => {
  try {
    const post_array = [];
    post_array.push({
      target: targetUrl,
      max_crawl_pages: maxCrawlPages,
      load_resources: true,
      enable_javascript: true,
      custom_js: 'meta = {}; meta.url = document.URL; meta;',
      tag: 'some_string_123',
      pingback_url: 'https://your-server.com/pingscript?id=$id&tag=$tag',
    });

    const response = await axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/on_page/task_post',
      auth: {
        username: config.dataForSeoLogin,
        password: config.dataForSeoPassword,
      },
      data: post_array,
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.data?.status_code !== 20000) {
      throw new Error('Failed to create task: ' + response.data?.status_message);
    }

    const taskId = response.data?.tasks?.[0]?.id;
    if (!taskId) {
      throw new Error('No task ID received');
    }

    return taskId;
  } catch (err) {
    console.error('Task creation error:', err);
    throw new Error('Failed to create SEO analysis task');
  }
};
/**
 * Verifica el estado de la tarea en DataForSEO.
 * @param taskId ID de la tarea
 * @returns Datos del resultado de la verificación o null si no está listo
 */
export const checkPagesTaskStatus = async (taskId: string): Promise<any> => {
  try {
    const post_array = [];
    post_array.push({
      id: taskId,
      filters: [['resource_type', '=', 'html'], 'and', ['meta.scripts_count', '>', 40]],
      order_by: ['meta.content.plain_text_word_count,desc'],
      limit: 100,
    });

    const response = await axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/on_page/pages',
      auth: {
        username: config.dataForSeoLogin,
        password: config.dataForSeoPassword,
      },
      data: post_array,
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.data?.status_code !== 20000) {
      throw new Error('Failed to check task: ' + response.data?.status_message);
    }

    const result = response.data?.tasks?.[0]?.result?.[0];
    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.error('Task status check error:', err);
    throw new Error('Failed to check task progress');
  }
};

export const pollPagesTaskStatus = async (
  taskId: string,
  totalPages: number,
  setProgress: (val: number) => void,
  setPagesChecked: (val: number) => void,
  setPercentage: (val: number) => void,
): Promise<DataForSEOOnPagePagesResponse> => {
  let attempts = 0;
  const maxAttempts = 999999999999999;

  while (attempts < maxAttempts) {
    const result = await checkPagesTaskStatus(taskId);

    if (result) {
      const { crawl_progress, crawl_status } = result;

      if (crawl_status) {
        const { pages_crawled = 0 } = crawl_status;
        setPagesChecked(pages_crawled);
        setProgress((pages_crawled / totalPages) * 100);
        setPercentage((pages_crawled / totalPages) * 100);
      }

      if (crawl_progress === 'finished' || (crawl_status?.pages_crawled || 0) >= totalPages) {
        return result;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, config.dataForSeoPollInterval));
    attempts++;
  }

  throw new Error('Task timed out. Please try again.');
};

export const instantPages = async (url: string): Promise<DataForSEOTaskResult | null> => {
  try {
    const post_array = [];
    post_array.push({
      url: url,
      enable_javascript: true,
      custom_js: 'meta = {}; meta.url = document.URL; meta;',
    });

    const response = await axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/on_page/instant_pages',
      auth: {
        username: config.dataForSeoLogin,
        password: config.dataForSeoPassword,
      },
      data: post_array,
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.data?.status_code !== 20000) {
      throw new Error('Failed to check task: ' + response.data?.status_message);
    }

    const result = response.data?.tasks?.[0]?.result?.[0];
    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.error('Task status check error:', err);
    throw new Error('Failed to check task progress');
  }
};
