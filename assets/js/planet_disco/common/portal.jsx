function Portal({ children }) {
  const el = document.createElement("div");

  useEffect(
    () => {
      modalRoot.appendChild(el);
      return () => {
        modalRoot.removeChild(el);
      };
    },
    [el]
  );

  return ReactDOM.createPortal(children, el);
}