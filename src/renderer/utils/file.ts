import { stringify } from "./misc";

// eslint-disable-next-line import/prefer-default-export
export function exportData(exportDataProps:App.ExportDataProps) {
  const {
    data,
    fileName,
    exportType,
  } = exportDataProps;

  if (exportType === 'jsonc') {
    const jsonString = `data:text/json;charset=utf-8,${
      encodeURIComponent(stringify(data))
    }`;
    // TODO: up to this line modularise this fn.
    // Renderer export should be link download
    // electron export should use fs
    // others should be DRY
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${fileName}.${exportType}`;
    link.click();

  };

};

