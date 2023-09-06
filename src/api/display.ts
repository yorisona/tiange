// @ts-nocheck
import request from '@/utils/request';

export function saveDisplay(displaypass) {
  return request({
    url: '/api/star/add_display',
    method: 'post',
    data: displaypass,
  });
}

export function updateDisplay(displaypass) {
  return request({
    url: '/api/star/update_display',
    method: 'post',
    data: displaypass,
  });
}

export function queryDisplays(displaypass) {
  return request({
    url: '/api/star/query_displays',
    method: 'get',
    params: displaypass,
  });
}

export function deleteDisplay(displaypass) {
  return request({
    url: '/api/star/delete_display',
    method: 'get',
    params: displaypass,
  });
}

export function saveProduct(productpass) {
  return request({
    url: '/api/star/add_product',
    method: 'post',
    data: productpass,
  });
}

export function updateProduct(productpass) {
  return request({
    url: '/api/star/update_product',
    method: 'post',
    data: productpass,
  });
}

export function deleteProduct(productpass) {
  return request({
    url: '/api/star/delete_product',
    method: 'get',
    params: productpass,
  });
}

export function queryProducts(productpass) {
  return request({
    url: '/api/star/query_products',
    method: 'get',
    params: productpass,
  });
}

export function exportDisplays(exportpass) {
  return request({
    url: '/api/star/export_displays',
    method: 'get',
    params: exportpass,
  });
}

export function exportStarFile(exportpass) {
  return request({
    url: '/api/star/export_star_file',
    method: 'get',
    params: exportpass,
  });
}

// export function uploadDisplay (file) {
//   return request({
//     url: '/api/star/upload_display',
//     method: 'post',
//     data: file
//   })
// }

// export function uploadproduct (file) {
//   return request({
//     url: '/api/star/upload_product',
//     method: 'post',
//     data: file
//   })
// }
