/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import path from 'path';
import fs from 'fs';
import { URL } from 'url';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
};

export function writeToFile({dataToWrite='', filePathAndName=`./file-${Date.now()}`}) {
  fs.open(filePathAndName, 'r', () => {
    fs.writeFile(
      filePathAndName,
      dataToWrite,
      (error) => {
        if (error) console.error(error)
        console.log('Data written.')
      }
    )

  })

};

// TODO: modularise this fn or merge this with writeToFile()
export function exportData(
  {exportDataProps, filePath='./exports/'}:
    {exportDataProps:App.ExportDataProps, filePath:string }
) {
  const {
    data,
    fileName,
    exportType
  } = exportDataProps;

  if (exportType === 'jsonc') {
    const jsonString = `data:text/json;charset=utf-8,${
      encodeURIComponent(JSON.stringify(data, null, 2))
    }`;

    const filePathAndName = filePath+fileName;
    writeToFile({dataToWrite: jsonString, filePathAndName});

  }

}

