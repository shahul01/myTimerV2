import { FC, useEffect, useRef, useState } from 'react';
import Config from './Config/Config';

type SelectedExport = 'config' | string;

interface IExportDataProps {
  selectedExport: SelectedExport;

};


const ExportData: FC<IExportDataProps > = (props) => {
  const { selectedExport } = props;
  const configRef = useRef();

  function handleExportData() {
    if (selectedExport === 'config') {
      configRef.current?.exportPopulatedConfig();
    };
  };

  return (
    <div className='export-data'>
      {selectedExport === 'config'
        && (
          <Config ref={configRef} />
        )
      }

      <button
        type='button'
        onClick={handleExportData}
      >
        Export {selectedExport}
      </button>

    </div>
  )
};


export default ExportData;
