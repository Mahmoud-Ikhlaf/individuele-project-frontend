const getWsUrl = () => {
    let url;
    switch(import.meta.env.MODE) {
      case 'production':
        url = import.meta.env.VITE_DEV_RUNNER_WS_URL;
        break;
      case 'development':
      default:
        url = import.meta.env.VITE_PROD_RUNNER_WS_URL;
    }
    return url;
}


export default getWsUrl;