import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSkill } from "../../api/api";

const Onboarding = () => {
  const [skills, setSkills] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (skills.length === 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [skills]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!titre || !description || !categorie) return;
    setSkills([...skills, { titre, description, categorie }]);
    setTitre("");
    setDescription("");
    setCategorie("");
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFinish = async () => {
    if (skills.length === 0) return;
    setError("");
    try {
      for (const skill of skills) {
        await createSkill(skill);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.error || "Erreur lors de l'enregistrement des compétences");
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center tracking-tight">
          Ajoutez vos compétences
        </h1>
        <p className="text-lg text-gray-500 text-center mb-12">
          Ajoutez au moins une compétence pour continuer.
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 text-base p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleAddSkill} className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="React"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <input
                type="text"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                placeholder="Développement web"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre niveau et votre expérience"
              rows={3}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-xl text-base font-semibold hover:bg-gray-50 transition"
          >
            + Ajouter cette compétence
          </button>
        </form>

        {skills.length > 0 && (
          <div className="space-y-3 mb-10">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">{skill.titre}</p>
                  <p className="text-sm text-gray-500">{skill.categorie}</p>
                </div>
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleFinish}
          disabled={skills.length === 0}
          className="w-full px-8 py-4 rounded-xl bg-gray-900 text-white text-lg font-semibold hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Terminer l'inscription
        </button>

        {skills.length === 0 && (
          <p className="text-center text-gray-400 text-base mt-4">
            Ajoutez au moins une compétence pour continuer
          </p>
        )}
      </div>
    </div>
  );
};

export default Onboarding;