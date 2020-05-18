const serverAddr = "https://communify.leckrapi.xyz";
const localAddr = "http://192.168.178.221:4003";
const devLocal = true;

const Constants = {
  SERVER_ADDR: __DEV__ && devLocal ? localAddr : serverAddr,
};

export default Constants;
