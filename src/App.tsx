import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    useLoaderData,
    useSearchParams,
} from 'react-router-dom';

interface Province { id: number; name: string; }
interface Regency { id: number; name: string; province_id: number; }
interface District { id: number; name: string; regency_id: number; }
interface RegionData { provinces: Province[]; regencies: Regency[]; districts: District[]; }

const regionLoader = async (): Promise<RegionData> => {
    try {
        const response = await fetch('/data/indonesia_regions.json');
        if (!response.ok) throw new Error("Fetch failed");
        return await response.json();
    } catch (error) {
        console.error("Failed to load regions", error);
        return { provinces: [], regencies: [], districts: [] };
    }
};

const FilterPage = () => {
    const { provinces, regencies, districts } = useLoaderData() as RegionData;
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedProvinceId = searchParams.get('province');
    const selectedRegencyId = searchParams.get('regency');
    const selectedDistrictId = searchParams.get('district');

    const filteredRegencies = regencies.filter(
        (r) => r.province_id === Number(selectedProvinceId)
    );

    const filteredDistricts = districts.filter(
        (d) => d.regency_id === Number(selectedRegencyId)
    );

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set('province', e.target.value);
        params.delete('regency');
        params.delete('district');
        setSearchParams(params);
    };

    const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set('regency', e.target.value);
        params.delete('district');
        setSearchParams(params);
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set('district', e.target.value);
        setSearchParams(params);
    };

    const handleReset = () => {
        setSearchParams(new URLSearchParams());
    };

    const getProvinceName = () => provinces.find(p => p.id === Number(selectedProvinceId))?.name;
    const getRegencyName = () => regencies.find(r => r.id === Number(selectedRegencyId))?.name;
    const getDistrictName = () => districts.find(d => d.id === Number(selectedDistrictId))?.name;

    return (
        <div className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-[340px] bg-gray-50 border-r border-gray-200 flex flex-col h-full shrink-0">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="font-bold text-gray-800 text-[17px]">Frontend Assessment</span>
                </div>

                {/* Filters */}
                <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-[11px] font-bold text-gray-400 mb-6 tracking-wider uppercase">Filter Wilayah</h2>

                    {/* Province */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Provinsi</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <select
                                name="province"
                                value={selectedProvinceId || ''}
                                onChange={handleProvinceChange}
                                className="block w-full pl-9 pr-8 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                            >
                                <option value="" disabled hidden>Pilih Provinsi</option>
                                {provinces.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Regency */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Kota/Kabupaten</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <select
                                name="regency"
                                value={selectedRegencyId || ''}
                                onChange={handleRegencyChange}
                                disabled={!selectedProvinceId}
                                className="block w-full pl-9 pr-8 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <option value="" disabled hidden>Pilih Kota/Kabupaten</option>
                                {filteredRegencies.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* District */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Kecamatan</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <select
                                name="district"
                                value={selectedDistrictId || ''}
                                onChange={handleDistrictChange}
                                disabled={!selectedRegencyId}
                                className="block w-full pl-9 pr-8 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <option value="" disabled hidden>Pilih Kecamatan</option>
                                {filteredDistricts.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        {/* Reset Button */}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-blue-500 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span className="text-gray-600 font-bold text-xs tracking-[0.15em]">RESET</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Header/Breadcrumbs */}
                <header className="px-10 py-5 flex items-center border-b border-gray-50/0">
                    <nav aria-label="Breadcrumb" className="breadcrumb flex text-sm text-gray-400 font-medium">
                        <span className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">Indonesia</span>
                        {getProvinceName() && (
                            <>
                                <span className="mx-3 text-gray-300">›</span>
                                <span className={`transition-colors cursor-pointer ${getRegencyName() ? 'text-gray-400 hover:text-gray-600' : 'text-blue-500 hover:text-blue-600'}`}>{getProvinceName()}</span>
                            </>
                        )}
                        {getRegencyName() && (
                            <>
                                <span className="mx-3 text-gray-300">›</span>
                                <span className={`transition-colors cursor-pointer ${getDistrictName() ? 'text-gray-400 hover:text-gray-600' : 'text-blue-500 hover:text-blue-600'}`}>{getRegencyName()}</span>
                            </>
                        )}
                        {getDistrictName() && (
                            <>
                                <span className="mx-3 text-gray-300">›</span>
                                <span className="text-blue-500 hover:text-blue-600 cursor-pointer">{getDistrictName()}</span>
                            </>
                        )}
                    </nav>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto flex items-center justify-center p-10 mt-[-40px]">
                    <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-2xl text-center">

                        {/* Province Display */}
                        {getProvinceName() && (
                            <div className="flex flex-col items-center space-y-4">
                                <span className="text-xs font-bold text-[#8ba6ce] tracking-[0.2em] uppercase">Provinsi</span>
                                <h1 className="text-5xl md:text-[56px] font-extrabold text-[#192330] tracking-tight leading-none">{getProvinceName()}</h1>
                            </div>
                        )}

                        {/* Down Arrow separator 1 */}
                        {getRegencyName() && (
                            <div className="text-[#cbd5e1] mt-6 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        )}

                        {/* Regency Display */}
                        {getRegencyName() && (
                            <div className="flex flex-col items-center space-y-4">
                                <span className="text-xs font-bold text-[#8ba6ce] tracking-[0.2em] uppercase">Kota / Kabupaten</span>
                                <h2 className="text-5xl md:text-[56px] font-extrabold text-[#192330] tracking-tight leading-none">{getRegencyName()}</h2>
                            </div>
                        )}

                        {/* Down Arrow separator 2 */}
                        {getDistrictName() && (
                            <div className="text-[#cbd5e1] mt-6 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        )}

                        {/* District Display */}
                        {getDistrictName() && (
                            <div className="flex flex-col items-center space-y-4">
                                <span className="text-xs font-bold text-[#8ba6ce] tracking-[0.2em] uppercase">Kecamatan</span>
                                <h3 className="text-5xl md:text-[56px] font-extrabold text-[#192330] tracking-tight leading-none">{getDistrictName()}</h3>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <FilterPage />,
        loader: regionLoader,
        errorElement: <div className="p-10 text-red-500 font-sans">Data tidak dapat dimuat. Pastikan file /data/indonesia_regions.json tersedia.</div>
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
