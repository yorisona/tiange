// @ts-nocheck
import { getUserInfo } from '@/api/auth';

export function loginRequired() {
  getUserInfo()
    .then(response => {
      const data = response.data;
      if (!data.success) {
        this.$router.push({ name: 'Login' });
        // vm.$message.error({message: '请登录'})
      }
    })
    .catch(error => {
      this.loading = false;
      console.log(error);
    });
}
