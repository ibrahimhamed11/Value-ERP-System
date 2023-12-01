import { toast } from 'react-toastify';

const showToast = (message, time, type) => {
  if (type === 'success') {
    toast.success(message, {
      position: 'top-right',
      autoClose: time,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    });
  } else if (type === 'error') {
    toast.error(message, {
      position: 'top-right',
      autoClose: time,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    });
  }
};

export default showToast;
