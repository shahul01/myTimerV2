import { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { exportData } from 'renderer/utils/file';
import { getFormattedDateTime } from 'renderer/utils/time';
import { api } from 'renderer/utils/trpc';


interface IConfigProps {

};


const Config: FC<IConfigProps > = forwardRef((props, ref) => {
  // const {  } = props;

  // const trpcContext = api.useContext();

  const { data: dbGetAllTasks } = api.task.getAllTasks.useQuery();


  const user = {name:'shahul01'};
  const configToExport:App.RendererConfig = {
    // TODO: add reducers for these hard coded values
    taskType: 'timer',
    taskConfig: {
      lastSelectedTask: 'timer',
      lastSelectedId: ''
    },

    // yo what's up playa

    /**
     * boiiii
     */

    tasks: {
      timer: [],
      stopwatch: [],
      clock: []
    },
  };

  useImperativeHandle(ref, () => ({
    // fn is passed to parent.

    exportPopulatedConfig() {

      // TODO: also get electron's data

      // const currentApp:CurrentApp = 'electron';
      // if (currentApp === 'electron') send data to electron;
      // else just export it with version, date and user

      function populateConfig() {
        function populateTasks() {
          if (!dbGetAllTasks) return;
          configToExport.tasks.timer = [...dbGetAllTasks];
        };

        populateTasks();
        console.log(`configToExport: `, configToExport);
      };

      populateConfig();
      const exportDataProps = {
        data: configToExport,
        fileName: `myTimer-${user.name}-${getFormattedDateTime(new Date())}`,
        exportType: 'jsonc',
      } as const;
      exportData(exportDataProps);

    }

  }));


  return (
    <div className='config'/>
  )
});


export default Config;
