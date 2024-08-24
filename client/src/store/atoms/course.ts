import {atom} from "recoil";

interface Course {
  _id: string;
  title: string;
  description: string;
  imageLink: string;
  price: number;
}

interface CourseState{
  isLoading ?: boolean,
  course: Course | null
}

export const courseState = atom<CourseState>({
  key: 'courseState',
  default: {
    isLoading: true,
    course: null
  },
});
