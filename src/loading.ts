function getElement() {
  const div = document.createElement('div');
  div.style.cssText = `
    width: 100%;
    min-height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  `.trim();
  div.innerHTML = `
    <div style="flex:1" class="ant-spin ant-spin-lg ant-spin-spinning">
    <span class="ant-spin-dot ant-spin-dot-spin">
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
    </span>
    </div>
  `;
  return div;
}

const createLoading = () => {
  let isLoading = false;
  const df = getElement();

  return {
    show(moduleContainer: HTMLElement) {
      if (isLoading) {
        return;
      }

      isLoading = true;

      if (moduleContainer && moduleContainer.appendChild) {
        try {
          moduleContainer.appendChild(df);
        } catch (error) {
          console.error(error);
        }
      }
    },
    hide(moduleContainer: HTMLElement) {
      if (moduleContainer && moduleContainer.contains(df)) {
        try {
          moduleContainer.removeChild(df);
        } catch (error) {
          console.error(error);
        }
      }

      isLoading = false;
    },
  };
};

export default createLoading;
