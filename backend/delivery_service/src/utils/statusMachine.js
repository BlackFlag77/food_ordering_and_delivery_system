const transitions = {
  pending: ["assigned"],
  assigned: ["en_route"],
  en_route: ["delivered"],
  delivered: [], // Terminal state
};

exports.validateTransition = (oldStatus, newStatus) => {
  return transitions[oldStatus].includes(newStatus);
};
