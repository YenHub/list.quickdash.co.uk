export const initialiseStaging = () => {
    if(process.env.REACT_APP_BETA === 'true') {
        window.localStorage.setItem('mdMode', 'true');
    }
};
