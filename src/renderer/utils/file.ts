import { stringify } from "./misc";

type TExportDataProps = {
  data: unknown;
  fileName: string;
  exportType: 'jsonc';
};

// eslint-disable-next-line import/prefer-default-export
export function exportData(exportDataProps:TExportDataProps) {
  const {
    data,
    fileName,
    exportType,
  } = exportDataProps;

  if (exportType === 'jsonc') {
    const jsonString = `data:text/json;charset=utf-8,${
      encodeURIComponent(stringify(data))
    }`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${fileName}.${exportType}`;
    link.click();

  };

};

