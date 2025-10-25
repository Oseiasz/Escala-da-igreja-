import React, { useState, useRef } from 'react';
import { Member } from '../../types';

interface MemberManagerProps {
  members: Member[];
  onMembersChange: (members: Member[]) => void;
}

const MemberManager: React.FC<MemberManagerProps> = ({ members, onMembersChange }) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingAvatar, setEditingAvatar] = useState<string>('');
  const [recentlySavedIndex, setRecentlySavedIndex] = useState<number | null>(null);

  const newAvatarInputRef = useRef<HTMLInputElement>(null);
  const editAvatarInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setter(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = () => {
    const trimmedName = newMemberName.trim();
    if (trimmedName && !members.some(m => m.name.toLowerCase() === trimmedName.toLowerCase())) {
      const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=random&color=fff&rounded=true&size=40`;
      onMembersChange([...members, { name: trimmedName, avatar: newMemberAvatar || defaultAvatar }]);
      setNewMemberName('');
      setNewMemberAvatar(null);
      if (newAvatarInputRef.current) {
        newAvatarInputRef.current.value = '';
      }
    }
  };

  const handleRemoveMember = (index: number) => {
    onMembersChange(members.filter((_, i) => i !== index));
  };
  
  const handleStartEditing = (index: number, member: Member) => {
    setEditingIndex(index);
    setEditingName(member.name);
    setEditingAvatar(member.avatar);
  };

  const handleCancelEditing = () => {
    setEditingIndex(null);
    setEditingName('');
    setEditingAvatar('');
  };

  const handleSaveEdit = (index: number) => {
    const trimmedName = editingName.trim();
    if (trimmedName && (!members.some((m, i) => i !== index && m.name.toLowerCase() === trimmedName.toLowerCase()))) {
        const updatedMembers = [...members];
        const originalMember = members[index];
        let finalAvatar = editingAvatar;

        // If the name changed and the avatar is the default UI-Avatars, regenerate it.
        if (originalMember.name !== trimmedName && finalAvatar.includes('ui-avatars.com')) {
          finalAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=random&color=fff&rounded=true&size=40`;
        }

        updatedMembers[index] = { name: trimmedName, avatar: finalAvatar };
        onMembersChange(updatedMembers);
        handleCancelEditing();
        setRecentlySavedIndex(index);
        setTimeout(() => {
            setRecentlySavedIndex(null);
        }, 2000);
    }
  };

  const handleRemoveEditingAvatar = () => {
    if (editingName) {
      const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(editingName)}&background=random&color=fff&rounded=true&size=40`;
      setEditingAvatar(defaultAvatar);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add new member form */}
      <div className="p-4 border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700/30">
        <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Add New Member</h4>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-3 flex-grow w-full">
                <img 
                    src={newMemberAvatar || 'https://ui-avatars.com/api/?name=?&background=e5e7eb&color=6b7280&rounded=true&size=40'} 
                    alt="New member avatar" 
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
                <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="New member's name"
                    className="flex-grow p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                />
            </div>
            <div className="flex w-full sm:w-auto">
                <label className="cursor-pointer w-full text-center px-4 py-2 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors text-sm">
                    Upload Avatar
                    <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        ref={newAvatarInputRef}
                        onChange={(e) => handleFileSelect(e, setNewMemberAvatar)}
                    />
                </label>
                <button
                    onClick={handleAddMember}
                    className="px-4 py-2 bg-gray-700 dark:bg-blue-600 text-white font-semibold rounded-md hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors ml-2"
                >
                    Add
                </button>
            </div>
        </div>
      </div>

      {/* Member list */}
      <ul className="space-y-2">
        {members.map((member, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-2 rounded-md transition-all duration-500 ${recentlySavedIndex === index ? 'bg-green-100 dark:bg-green-900/40 ring-2 ring-green-200 dark:ring-green-700' : 'bg-gray-50 dark:bg-slate-700/30'}`}
          >
            {editingIndex === index ? (
              <div className='flex-grow flex items-center space-x-2'>
                <img src={editingAvatar} alt="Editing avatar" className="w-10 h-10 rounded-full" />
                <div className="flex-grow">
                    <input 
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full p-1 border border-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-md"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                    />
                     <div className="mt-1 space-x-3">
                        <label className="cursor-pointer text-xs text-blue-600 dark:text-blue-400 hover:underline">
                            Change
                            <input type="file" accept="image/*" className="hidden" ref={editAvatarInputRef} onChange={(e) => handleFileSelect(e, setEditingAvatar)} />
                        </label>
                        <button onClick={handleRemoveEditingAvatar} type="button" className="text-xs text-red-600 dark:text-red-400 hover:underline">
                           Reset
                        </button>
                    </div>
                </div>
                 <button onClick={() => handleSaveEdit(index)} className="text-green-600 hover:text-green-800 dark:hover:text-green-400 p-2"><i className="fa-solid fa-check fa-lg"></i></button>
                 <button onClick={handleCancelEditing} className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-2"><i className="fa-solid fa-times fa-lg"></i></button>
              </div>
            ) : (
                <>
                <span className="flex items-center">
                  <img src={member.avatar} alt={`${member.name}'s avatar`} className="w-10 h-10 rounded-full mr-3" />
                  <span className="font-medium text-gray-800 dark:text-gray-100">{member.name}</span>
                  {recentlySavedIndex === index && (
                    <i className="fa-solid fa-check text-green-600 dark:text-green-400 ml-2 animate-pulse"></i>
                  )}
                </span>
                <div className="space-x-3">
                    <button onClick={() => handleStartEditing(index, member)} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    <i className="fa-solid fa-pencil mr-1"></i> Edit
                    </button>
                    <button
                    onClick={() => handleRemoveMember(index)}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                    <i className="fa-solid fa-trash-can mr-1"></i> Delete
                    </button>
                </div>
                </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberManager;