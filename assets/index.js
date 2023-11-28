console.log('ok');
axios
  .get('https://randomuser.me/api/')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
