import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import gif from './check-circle.gif'

const PopupModal = ({ open, handleClose, time }) => {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
    const timeout = setTimeout(() => {
      handleClose();
    }, time);

    return () => clearTimeout(timeout);
  }, [open, handleClose, time]);

  return (
    <Modal
      open={isVisible}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 20,
          textAlign: 'center',
        }}
      >
        <img src={gif} alt="Loading..." />
        <p>New Cost Center Added</p>
      </Box>
    </Modal>
  );
};

export default PopupModal;
