import { UPLOAD_FILE_API } from '@/apis/file';
import { HttpResponse } from '@/types/base/http';
import { Post } from '@/utils/request';

export const uploadFileService = async (
  data: any,
): Promise<HttpResponse<{ size: number; source: string }>> => Post(UPLOAD_FILE_API, data);
