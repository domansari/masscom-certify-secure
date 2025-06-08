
import { CertificateData } from "@/types/certificate";

interface CertificateBodyProps {
  data: CertificateData;
}

const CertificateBody = ({ data }: CertificateBodyProps) => {
  return (
    <>
      {/* Certificate Title */}
    
           <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
      <div className="text-center mb-5">
      
        <p className="text-2xl text-gray-800 mt-3">of Achievement,
    This is to certify that</p>
      </div>

      {/* Student Name */}
      <div className="text-center mb-4">
        <h2 className="text-5xl font-bold italic tracking-widest mb-3" style={{ color: '#b48811' }}>
          {data.studentName || "Student Name"}
        </h2>
    
      </div>

      {/* S/O, D/O and Roll No - Centered with equal gaps */}
      <div className="flex justify-center items-center gap-60 mb-5">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-3">S/O, D/O:</p>
          <div 
            className="border-b border-black pb-1 mx-auto"
            style={{ 
              width: `${Math.max(150, (data.fatherName?.length || 10) * 14)}px`
            }}
          >
            <p className="text-xl font-semibold text-center">{data.fatherName || "Father's Name"}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-3">Roll No:</p>
          <div 
            className="border-b border-black pb-1 mx-auto"
            style={{ 
              width: `${Math.max(120, (data.rollNo?.length || 8) * 16)}px`
            }}
          >
            <p className="text-xl font-semibold text-center">{data.rollNo || "Roll Number"}</p>
          </div>
        </div>
      </div>

      <p className="text-2xl text-gray-800 text-center mb-3">
        has successfully completed the course of
      </p> <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>   <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>  
   <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>   <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>   <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>   <div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div><div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div><div className="text-center mb-5">
              <p className="text-2xl text-gray-800 mt-2"></p>
        <p className="text-2xl text-gray-800 mt-2"></p>
      </div>
      {/* Course Name */}
      <div className="border-b-2 border-black pb-2 mx-20 mb-4">
        <h4 className="text-3xl font-bold text-black text-center">
          {data.courseName || "Course Name"}
        </h4>
      </div>

      {/* Seal Image - Center aligned above course name */}
      <div className="flex justify-center mb-1">
    
      </div>

      {/* Duration, Grade, and Date in one row */}
      <div className="flex justify-center items-center gap-55 mb-3">
        <div className="text-center">
          <p className="text-x1 font-semibold text-black-700 mb-3">Duration:
              {data.duration ? `${data.duration}` : "Duration"}
         </p>

 <div className="text-center">
          <p className="text-x1 font-semibold text-black-700 mb-3">Grade:
            {data.grade || "Grade"}
         </p>
          
          <div className="border-b border-black pb-1 px-4">
        </div>
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-3">Grade:</p>
          <div className="border-b border-black pb-1 px-4">
            <p className="text-xl font-semibold">{data.grade || "Grade"}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-3">Date of Issue:</p>
          <div className="border-b border-black pb-1 px-4">
            <p className="text-xl font-semibold">
              {data.completionDate ? new Date(data.completionDate).toLocaleDateString() : "Date"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateBody;
