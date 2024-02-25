import { useFormikContext } from 'formik';
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
import React, { useMemo, useRef } from 'react';

const JobDesc = ({ errors, touched, values, handleChange, handleBlur }) => {
  const { setFieldValue } = useFormikContext();
  const editor = useRef(null);
  const config = useMemo(() => (
    {
      readonly: false,
      placeholder: 'Write Job Description...',
      buttons: 'bold,italic,underline,ul,ol,font,fontsize',
    }),
    []
  );

  return (
    <div className='flex flex-col'>
      <JoditEditor
        ref={editor}
        value={values.jobDescription}
        config={config}
        tabIndex={4}
        onBlur={newContent => setFieldValue("jobDescription", newContent)}
        onChange={newContent => { }}
      />
      {errors.jobDescription && touched.jobDescription && (
        <div className='text-red-600'>{errors.jobDescription}</div>
      )}
    </div>
  );
};

export default JobDesc;
