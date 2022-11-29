export function setParam(key: string, value: string) {
  let params = getUrlParams(key, value);
  let location = window.location.pathname;
  history.replaceState(null, null as any, location + '?' + params);
}
export function getUrlParams(key: string, value: string) {
  let params: string[] = [];
  if (window.location.search) {
    params = decodeURIComponent(window.location.search)
      .slice(1)
      .split('&');
    if (decodeURIComponent(window.location.search).indexOf(key) > -1) {
      params = params.map(param => {
        if (param.indexOf(key) > -1) {
          return key + '=' + value;
        }
        return param;
      });
    } else {
      if (value) {
        params = params.concat([key + '=' + value]);
      }
    }
  } else {
    if (value) {
      params = [key + '=' + value];
    }
  }
  return params.join('&');
}
export function parseUrl(): { [key: string]: string } {
  let arrs = [];

  if (window.location.search) {
    let out: { [k: string]: string } = {};
    arrs = decodeURIComponent(window.location.search)
      .slice(1)
      .split('&');
    arrs.forEach(elem => {
      let ind = elem.split('=')[0] || ''
      out[ind] = elem.split('=')[1] || '';
    });
    return out;
  } else {
    return {};
  }
}
