export const addValueToQueryUrl = (queryName: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    params.set(queryName, value);
    const newUrl = `${window.location.origin}${
        window.location.pathname
    }?${params.toString()}`;

    window.history.pushState({ path: newUrl }, '', newUrl);
};

export const getQueryParams = () => {
    const search = window.location.search.substring(1);
    return search
        ? JSON.parse(
              '{"' +
                  decodeURI(search)
                      .replace(/"/g, '\\"')
                      .replace(/&/g, '","')
                      .replace(/=/g, '":"') +
                  '"}',
          )
        : '';
};
