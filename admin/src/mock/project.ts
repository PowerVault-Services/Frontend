export interface Project {
  id: string;
  name: string;
  location: string;
  systemSize: number;
  pvModule: number;
  phone: string;
  email: string;
}

export const PROJECTS: Project[] = [
  {
    id: "robinson_ccs",
    name: "Robinson Chachoengsao",
    location: "910 หมู่ 4 ถ.บางปะกง-ฉะเชิงเทรา ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา 24000",
    systemSize: 1200,
    pvModule: 2400,
    phone: "038-123-456",
    email: "contact@robinson.co.th",
  },
];
