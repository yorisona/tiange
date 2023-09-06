/**
 * 一些不太好归类的请求
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-15 10:06:13
 */
import { HttpResponse } from '@/types/base/http';
import { Post } from '@/utils/request';

/**
 * 上传凭证
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-15 10:07:19
 */
export const UploadCertificate = async (
  formData: FormData,
): Promise<
  HttpResponse<{
    /** size */
    size: number;
    /** 地址 */
    source: string;
  }>
> => Post('/api/resources/upload_certificate', formData);
