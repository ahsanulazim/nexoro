"use client";
import { LuImage, LuSend } from "react-icons/lu";

const Conversation = () => {
  return (
    <div className="bg-base-100">
      <div className="p-5 overflow-y-auto h-[calc(100dvh-240px)]">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
              />
            </div>
          </div>

          <div className="chat-bubble">You were the Chosen One!</div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
              />
            </div>
          </div>

          <div className="chat-bubble">I hate you!</div>
          <div className="chat-footer opacity-50">Seen at 12:46</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
              />
            </div>
          </div>

          <div className="chat-bubble">You were the Chosen One!</div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
      </div>
      <div className="p-5 bg-base-300">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-end gap-2"
        >
          <label htmlFor="message" className="input w-full">
            <input
              name="message"
              type="text"
              placeholder="Write a message"
              required
            />
            <input
              type="file"
              accept="image/*"
              name="image"
              id="image"
              hidden
            />
            <label htmlFor="image" className="link">
              <LuImage />
            </label>
          </label>
          <button type="submit" className="btn btn-circle btn-info">
            <LuSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
