// @ts-nocheck
import { queryStarSug } from '@/api/star';

const allStars = [];
queryStarSug().then(response => {
  const result = response.data;
  if (result.success) {
    result.data.star_data.forEach(item => {
      allStars.push({
        value: item.star_name,
        star_id: item.star_id,
      });
    });
  } else {
    console.log(result.message);
  }
  return allStars;
});

export { allStars };

export function getAllStar() {
  return new Promise((resolve, reject) => {
    const allStars = [];
    return queryStarSug()
      .then(response => {
        const result = response.data;
        if (result.success) {
          result.data.star_data.forEach(item => {
            allStars.push({
              value: item.star_name,
              star_id: item.star_id,
            });
          });
        } else {
          console.log(result.message);
        }
        return resolve(allStars);
      })
      .catch(error => {
        return reject(error);
      });
  });
}
