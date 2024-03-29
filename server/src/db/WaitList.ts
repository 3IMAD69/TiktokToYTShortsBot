import { Schema, model } from 'mongoose';


interface ILinks {
    tiktokLink: string;
    title?:string,
    description?:string,
    dynamic_cover?:string,
    logo: boolean;
    filter: boolean;
    watermark: boolean;
    duration:number;
    isWorking:boolean;
    type:string
  }

  const WaitListSchema = new Schema<ILinks>({
    tiktokLink: { type: String, required: true },
    title: { type: String, required: false },
    description: { type: String, required: false },
    dynamic_cover: { type: String, required: false },
    logo: { type: Boolean, required: true },
    filter: { type: Boolean, required: true },
    watermark: { type: Boolean, required: true },
    duration: { type: Number, required: true },
    isWorking: { type: Boolean, required: true },
    type : { type :  String, required: true}
  },
  { timestamps: true }
  );

  type UpdateDataType = {
    id:string,
    tiktokLink:string,
    title:string,
    description:string,
    logo:boolean,
    filter:boolean,
    watermark:boolean
  }

    //MODAL 
  export const WaitList = model<ILinks>('waitlists', WaitListSchema);

  export const GetWaitListCount = () => WaitList.countDocuments({});

  export const GetAllWaitList = () => WaitList.find()

  export const GetFirstWaitList = () => WaitList.findOne()

  export const CheckifisWorking = () => WaitList.countDocuments({isWorking:true})

  export const ChangeIsWorkingState = (id:string,state:boolean) => WaitList.findByIdAndUpdate(id,{isWorking:state})
  
  export const CreateLink = (values:ILinks) => new WaitList(values).save().then((link)=>console.log('saved Link : '+link))

  export const DeleteLink = (id:string) => WaitList.findOneAndDelete({_id:id}).then(()=>console.log("Deleted from db "+id))

  export const UpdateLink = (ttData:UpdateDataType)=> WaitList.findByIdAndUpdate(ttData.id,ttData)