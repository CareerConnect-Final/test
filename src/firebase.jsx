import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCn763LejyTP6knBFlySbSbLFsw0Bjl2Pw",
  authDomain: "test-3a95c.firebaseapp.com",
  projectId: "test-3a95c",
  storageBucket: "test-3a95c.appspot.com",
  messagingSenderId: "329280170910",
  appId: "1:329280170910:web:7828d79cd7831d61d1848f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);