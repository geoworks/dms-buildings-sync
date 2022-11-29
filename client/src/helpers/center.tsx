import React from 'react';

const center = ({ children, style }) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default center;
