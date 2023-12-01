import * as React from 'react';

export function lazyImport(factory, name) {
  const x = Object.create({
    [name]: React.lazy(() =>
      factory().then((module) => {
        return { default: module[name] };
      })
    )
  });

  return x;
}
