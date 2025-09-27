import farmerFamily from "@/assets/farmer-family.png"; // put your image in assets

export const FarmerFamily = () => (
  <div className="flex flex-col items-center text-center animate-fade-in">
    <img
      src={farmerFamily}
      alt="Happy Farmer Family"
      className="w-48 md:w-64 mb-3 animate-bounce-slow"
    />
    <p className="text-emerald-800 font-bold text-lg">
      From Soil to Smiles — Farming Made Smarter 🌾
    </p>
  </div>
);
