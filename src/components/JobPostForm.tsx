'use client'
import React, { useCallback, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import CKEditor from './CKEditor';
import { useAuth } from '@/hooks/useAuth';

export interface JobPostFormValues {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salary: string;
  location: string;
  experience: string;
  deadline: string;
  category_id: string;
  level_id: string;
  posted_by_id: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Level {
  id: string;
  name: string;
}

export const jobPostSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tiêu đề không được để trống')
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: Yup.string()
    .required('Mô tả không được để trống')
    .min(50, 'Mô tả phải có ít nhất 50 ký tự'),
  requirements: Yup.string()
    .required('Yêu cầu không được để trống')
    .min(30, 'Yêu cầu phải có ít nhất 30 ký tự'),
  benefits: Yup.string()
    .required('Quyền lợi không được để trống')
    .min(30, 'Quyền lợi phải có ít nhất 30 ký tự'),
  salary: Yup.string()
    .required('Lương không được để trống')
    .matches(/^[0-9]+$/, 'Lương chỉ được chứa số'),
  location: Yup.string()
    .required('Địa điểm không được để trống'),
  experience: Yup.string()
    .required('Kinh nghiệm không được để trống')
    .matches(/^[0-9]+$/, 'Kinh nghiệm phải là số'),
  deadline: Yup.date()
    .required('Hạn nộp không được để trống')
    .min(new Date(), 'Hạn nộp phải trong tương lai'),
  category_id: Yup.string()
    .required('Danh mục không được để trống'),
  level_id: Yup.string()
    .required('Vị trí không được để trống'),
  posted_by_id: Yup.string()
    .required('ID người đăng không được để trống'),
});

interface JobPostFormProps {
  initialValues: JobPostFormValues;
  categories: Category[];
  levels: Level[];
  onSubmit: (values: JobPostFormValues, formikHelpers: { setSubmitting: (isSubmitting: boolean) => void }) => Promise<void>;
  submitButtonText: string;
  cancelButtonText?: string;
  onCancel?: () => void;
}

// Memoized form field components with debounced onChange
const TextField = React.memo(({ name, label, placeholder, errors, touched }: any) => {
  const { setFieldValue, values } = useFormikContext<JobPostFormValues>();
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, e.target.value);
  }, [name, setFieldValue]);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={values[name as keyof JobPostFormValues] || ''}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg ${
          errors[name] && touched[name] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
});

const SelectField = React.memo(({ name, label, options, placeholder, errors, touched }: any) => {
  const { setFieldValue, values } = useFormikContext<JobPostFormValues>();
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue(name, e.target.value);
  }, [name, setFieldValue]);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={values[name as keyof JobPostFormValues] || ''}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg appearance-none bg-white ${
          errors[name] && touched[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option: any) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
});

const DateField = React.memo(({ name, label, errors, touched }: any) => {
  const { setFieldValue, values } = useFormikContext<JobPostFormValues>();
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, e.target.value);
  }, [name, setFieldValue]);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="date"
        value={values[name as keyof JobPostFormValues] || ''}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg ${
          errors[name] && touched[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
});

const EditorField = React.memo(({ name, label, value, onChange, placeholder }: any) => {
  const { setFieldValue } = useFormikContext();
  
  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleChange = useCallback((newValue: string) => {
    setFieldValue(name, newValue, false); // Set validateOnChange to false
  }, [name, setFieldValue]);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="ck-editor-wrapper">
        <CKEditor
          key={name} // Add key to ensure proper instance management
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.value === nextProps.value &&
    prevProps.placeholder === nextProps.placeholder
  );
});

const SalaryField = React.memo(({ name, label, placeholder, errors, touched }: any) => {
  const { setFieldValue, values } = useFormikContext<JobPostFormValues>();
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, e.target.value);
  }, [name, setFieldValue]);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={values[name as keyof JobPostFormValues] || ''}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg ${
          errors[name] && touched[name] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
});

export default function JobPostForm({
  initialValues,
  categories,
  levels,
  onSubmit,
  submitButtonText,
  cancelButtonText = 'Hủy',
  onCancel,
}: JobPostFormProps) {
  const { user } = useAuth();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = useCallback(async (values: JobPostFormValues, formikHelpers: any) => {
    if (!user?.id) {
      console.error('User ID is not available');
      return;
    }

    try {
      setSubmitError(null);
      const formValues = {
        ...values,
        posted_by_id: user.id,
      };
      await onSubmit(formValues, formikHelpers);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Có lỗi xảy ra khi gửi form. Vui lòng kiểm tra lại thông tin.');
    }
  }, [onSubmit, user]);

  const experienceOptions = useMemo(() => 
    [...Array(10)].map((_, index) => ({
      id: String(index + 1),
      name: `${index + 1} năm`
    })), []);

  const formInitialValues = useMemo(() => ({
    ...initialValues,
    posted_by_id: user?.id || '',
  }), [initialValues, user]);

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={jobPostSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ isSubmitting, errors, touched, setFieldValue, values, submitForm }) => (
        <Form className="space-y-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-4">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <TextField
              name="title"
              label="Tiêu Đề"
              placeholder="Nhập tiêu đề công việc"
              errors={errors}
              touched={touched}
            />

            <SelectField
              name="category_id"
              label="Danh Mục"
              options={categories}
              placeholder="Chọn danh mục"
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <SelectField
              name="level_id"
              label="Vị Trí"
              options={levels}
              placeholder="Chọn vị trí"
              errors={errors}
              touched={touched}
            />

            <SalaryField
              name="salary"
              label="Mức Lương"
              placeholder="Nhập mức lương"
              errors={errors}
              touched={touched}
            />

            <SelectField
              name="experience"
              label="Kinh Nghiệm (năm)"
              options={experienceOptions}
              placeholder="Chọn số năm kinh nghiệm"
              errors={errors}
              touched={touched}
            />
          </div>

          <EditorField
            name="description"
            label="Mô Tả Công Việc"
            value={values.description}
            onChange={(value: string) => setFieldValue('description', value)}
            placeholder="Nhập mô tả chi tiết công việc"
          />

          <EditorField
            name="requirements"
            label="Yêu Cầu"
            value={values.requirements}
            onChange={(value: string) => setFieldValue('requirements', value)}
            placeholder="Nhập yêu cầu công việc"
          />

          <EditorField
            name="benefits"
            label="Quyền Lợi"
            value={values.benefits}
            onChange={(value: string) => setFieldValue('benefits', value)}
            placeholder="Nhập quyền lợi công việc"
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              name="location"
              label="Địa Điểm"
              placeholder="Nhập địa điểm làm việc"
              errors={errors}
              touched={touched}
            />

            <DateField
              name="deadline"
              label="Hạn Nộp"
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {cancelButtonText}
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang xử lý...' : submitButtonText}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
} 