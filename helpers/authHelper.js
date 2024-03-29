import bcrypt from 'bcrypt';

export const hashPassword=async(password)=>{
      try {
        const saltRoundes=10;
         const hashedPassword=await bcrypt.hash(password,saltRoundes);
         return hashedPassword;
      } catch (error) {
        console.log(error)
      }
}

export const comparePassword=async(password,hashedPassword)=>{
    try {
         const isMatch=await bcrypt.compare(password,hashedPassword);
         return isMatch; 
    } catch (error) {
        console.log(error)
    }
}