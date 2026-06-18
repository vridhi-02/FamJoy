import React, { createContext, useState, useContext } from "react";

const FamilyContext = createContext();

export const FamilyProvider = ({ children }) => {
  const [members, setMembers] = useState([
    { 
      id: 1,
      name: "Sarah Johnson", 
      relation: "Mother", 
      bday: "14/03/1965",
      avatar: "👩",
      color: "#FFD4E5",
      notes: "",
    },
    { 
      id: 2,
      name: "Emma Johnson", 
      relation: "Daughter", 
      bday: "18/06/2015",
      avatar: "👧",
      color: "#D4F1FF",
      notes: "",
    },
    { 
      id: 3,
      name: "Liam Johnson", 
      relation: "Son", 
      bday: "02/09/2018",
      avatar: "👦",
      color: "#D4FFD4",
      notes: "",
    },
    { 
      id: 4,
      name: "John Johnson", 
      relation: "Father", 
      bday: "25/01/1963",
      avatar: "👨",
      color: "#FFE8D4",
      notes: "",
    },
  ]);

  const getAvatarForRelation = (relation) => {
    const avatars = {
      Parent: "👨",
      Father: "👨",
      Mother: "👩",
      Sibling: "👦",
      Son: "👦",
      Child: "👧",
      Daughter: "👧",
      Partner: "💑",
      Grandparent: "👴",
    };
    return avatars[relation] || "👤";
  };

  const getColorForRelation = (relation) => {
    const colors = {
      Parent: "#FFD4E5",
      Father: "#FFE8D4",
      Mother: "#FFD4E5",
      Sibling: "#D4F1FF",
      Son: "#D4FFD4",
      Child: "#D4FFD4",
      Daughter: "#D4F1FF",
      Partner: "#F0D4FF",
      Grandparent: "#FFD4E5",
    };
    return colors[relation] || "#FFD4E5";
  };

  const calculateDaysUntilBirthday = (birthDate) => {
    const [day, month, year] = birthDate.split("/").map(Number);
    const today = new Date();
    const currentYear = today.getFullYear();
    
    let nextBirthday = new Date(currentYear, month - 1, day);
    
    if (nextBirthday < today) {
      nextBirthday = new Date(currentYear + 1, month - 1, day);
    }
    
    const timeDiff = nextBirthday - today;
    const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return daysUntil;
  };

  const getMembersWithBirthdays = () => {
    return members.map(m => ({
      ...m,
      daysUntil: calculateDaysUntilBirthday(m.bday),
    })).sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const addMember = (memberData) => {
    const newMember = {
      id: Date.now(),
      ...memberData,
      avatar: getAvatarForRelation(memberData.relation),
      color: getColorForRelation(memberData.relation),
    };
    setMembers([...members, newMember]);
    return newMember;
  };

  const deleteMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMember = (id, updatedData) => {
    setMembers(members.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const value = {
    members: getMembersWithBirthdays(),
    addMember,
    deleteMember,
    updateMember,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error("useFamily must be used within FamilyProvider");
  }
  return context;
};
