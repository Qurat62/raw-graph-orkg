import React, { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import S from './UrlFetch.module.scss';

export async function fetchData(source) {
  const response = await fetch(source.url);
  const text = await response.text();
  return text;
}

export default function UrlFetch({
  userInput,
  setUserInput,
  setLoadingError,
  initialState = null,
}) {
  // const [url, setUrl] = useState(initialState?.url)
  const [url, setUrl] = useState();

  // Extract the encoded data parameter from the URL:
  const encodedURL = window.location.href;

  console.log(encodedURL); // output: the encoded data from the URL query string, without the leading '?' character

  // Decode the encoded data:
  const decodedURL = decodeURIComponent(encodedURL);
  console.log(decodedURL);
  // Split the decoded URL with "?" as the delimiter
  const splitUrl = decodedURL.split('?');

  console.log(splitUrl[1]);

  const fetchUrl = useCallback(
    async (url) => {
      debugger;
      const source = { type: 'url', url };
      let data;
      try {
        data = await fetchData(source);
        setUserInput(data, source);
        setLoadingError(null);
      } catch (e) {
        setLoadingError('Loading error. ' + e.message);
      }
    },
    [setLoadingError, setUserInput]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      fetchUrl(splitUrl[1]);
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [splitUrl[1], fetchUrl]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={classNames('w-100', S['url-input'])}
        value={splitUrl[1]}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />
      <div className="text-right">
        <button
          className="btn btn-sm btn-success mt-3"
          disabled={url}
          type="submit"
        >
          Load data
        </button>
      </div>
    </form>
  );
}
