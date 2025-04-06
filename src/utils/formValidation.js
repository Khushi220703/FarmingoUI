

export const validateEmail = (email) =>{

    if(!email){
        return "Enter email id."
    }

    const regex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)){
        return 'Please enter a valid email id.'
    }
    return null;
}

export const validateMobile = (mobile) =>{

    if(!mobile){
        return "Enter mobile number."
    }

    const regex = /^[6-9]\d{9}$/;
    if(!regex.test(mobile)){
        return "Mobile number must start from 6-9 and be 10 digits long."
    }
    return null;
}

export const validatePassword = (password) =>{

    if(!password){
        return 'Enter the passowrd';
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,15}$/;
    if(!regex.test(password)){
        return 'Password must be 6 to 15 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character.';
    }

    return null;
}

export const validateName = (name) =>{


    if(!name){
        return 'Please enter name.';
    }

    return null;
}

export const validatePH = (ph) =>{

    if(!ph){
        return 'Please enter ph value.';
    }
    else if(ph < 0 && ph > 15){
        return 'PH value should be in between 1 to 14.'
    }
}