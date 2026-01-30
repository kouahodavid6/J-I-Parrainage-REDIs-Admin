import LogoREDIs from "../../assets/images/LogoTropDouxRecup.jpg"

const LogoTropDouxRecup = () => {
    return(
        <div className="flex flex-col justify-center items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                    src={LogoREDIs} 
                    alt="Logo du Département informatique (REDIs)" 
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Trop<span className="text-orange-500">Doux</span>Récup</h1>
            </div>
        </div>
    );
}

export default LogoTropDouxRecup;