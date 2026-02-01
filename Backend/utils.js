const handlePeerConnection = async (socketId, offer) => {
  try {
    const pc = new RTCPeerConnection(configuration);
    
  } catch (error) {
    console.error('Error handling peer connection', error);
    throw error;
  }
};

module.exports = { handlePeerConnection };
