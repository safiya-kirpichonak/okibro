import React, { useState, useEffect } from "react";

import PromptCard from "./components/PromptCard";
import { StatusCodes } from "../../../helpers/http";
import UserService from "../../../services/UserService";
import Loading from "../../components/loading";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import PromptService from "../../../services/PromptService";
import CreatePromptSection from "./components/CreatePromptsSection";

const PromptsPage = () => {
  const [role, setRole] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPrompts = async () => {
    const userResponse = await UserService.getUser();
    const promptResponse = await PromptService.getList();
    if (
      userResponse.status === StatusCodes.OK &&
      promptResponse.status === StatusCodes.OK
    ) {
      setRole(userResponse.data.data.role.name);
      setPrompts(promptResponse.data.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrompts();
  }, []);

  return (
    <div>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <NavBar role={role} />
          <div className="container">
            <h1 style={{ margin: "40px 0 0 0" }}>Prompts</h1>
            <div style={{ margin: "40px 0 0 0" }}>
              <CreatePromptSection />
            </div>
            <div>
              {prompts &&
                prompts.map((prompt) => <PromptCard prompt={prompt} />)}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default PromptsPage;
