import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ModalVerDetalhes from "@/components/verDetalhes";
import { useRotulos } from "@/hooks/getRotulos";
import { useState } from "react";
// import ModalVerDetalhes from "@/components/verDetalhes";
// import { useState } from "react";

interface Props { }

interface Rotulos {
    ID_ROTULO: number;
    OBS: string;
    CODPROD: number;
    DESCRPROD: string;
    STATUS: string;
    STATUS2: string;
    ABERTOPDI: string;
    NOMEUSU: string;
    DATA_ENVIO: string;
    DATA_FINALIZACAO: string;
    DATA_CRIACAO: string;
}

const Kanban: React.FC<Props> = () => {
    const { data: rotulos = [] } = useRotulos();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalDetails, setModalDetails] = useState<boolean>(false);
    const [idClick, setIdClick] = useState<number | null>(null);

    const onClose = () => {
        setModalDetails(false);
    };


    const statusMap: Record<string, string> = {
        "PENDENTE": "Pendente de Avaliação",
        "ENVIADO": "Enviado para Avaliação",
        "REPROVADA": "Avaliação Reprovada",
        "FINALIZADA": "Finalizado"
    };

    const groupedRotulos: Record<string, Rotulos[]> = {
        "PENDENTE": [],
        "ENVIADO": [],
        "REPROVADA": [],
        "FINALIZADA": []
    };

    rotulos.forEach((rotulo: Rotulos) => {
        if (groupedRotulos.hasOwnProperty(rotulo.STATUS)) {
            groupedRotulos[rotulo.STATUS].push(rotulo);
        }
    });

    const filteredRotulos = (rotulos || []).filter((rotulo: Rotulos) =>
        rotulo.CODPROD.toString().includes(searchQuery ?? "") ||
        (rotulo.DATA_ENVIO && rotulo.DATA_ENVIO.includes(searchQuery ?? "")) ||
        (rotulo.DATA_FINALIZACAO && rotulo.DATA_FINALIZACAO.includes(searchQuery ?? "")) ||
        rotulo.DESCRPROD.toLowerCase().includes((searchQuery ?? "").toLowerCase())
    );


    return (
        <>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between mb-7">
                    <h2 className="text-3xl font-bold tracking-tight text-center">
                        Acompanhamento Geral dos Rótulos
                    </h2>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 mt-12">
                    {Object.entries(statusMap).map(([statusKey, statusTitle]) => (
                        <div key={statusKey} className="bg-gray-300 p-2 rounded-lg shadow-md min-h-[82vh]">
                            <h3 className={`text-xl font-semibold
                             mb-2 uppercase text-center items-center 
                            ${statusTitle.includes("Pendente de Avaliação") ? "text-yellow-600"
                                    : statusTitle.includes("Enviado para Avaliação") ? "text-blue-600"
                                        : statusTitle.includes("Finalizado") ? "text-green-600"
                                            : statusTitle.includes("Avaliação Reprovada") ? "text-red-600"
                                                : "text-grey-600"}`}>
                                {statusTitle}
                            </h3>


                            <div className="mb-2">
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full border-gray-500"
                                    placeholder="Pesquisar ..."
                                />
                            </div>

                            <ScrollArea className="h-[70vh] rounded-md p-5">

                                <div className="space-y-2">
                                    {filteredRotulos
                                        .filter(rotulo => rotulo.STATUS === statusKey)
                                        .map(rotulo => (
                                            <Card
                                                onClick={() => {
                                                    setModalDetails(true);
                                                    setIdClick(rotulo.ID_ROTULO);
                                                }}
                                                key={rotulo.CODPROD} className="border"
                                            >
                                                <CardHeader className="rounded-t-xl p-4">
                                                    <p className="text-lg font-bold mt-1 uppercase">
                                                        {rotulo.DESCRPROD}
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        Código do Rótulo:
                                                        <span className="font-bold ml-1">{rotulo.CODPROD}</span>
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        Usuário:
                                                        <span className="font-bold ml-1">{rotulo.NOMEUSU}</span>
                                                    </p>

                                                    {rotulo.DATA_CRIACAO && (
                                                        <p className="text-sm font-semibold">
                                                            Dt. Criação:
                                                            <span className=" font-bold ml-1">{rotulo.DATA_CRIACAO}</span>
                                                        </p>
                                                    )}

                                                    {rotulo.DATA_ENVIO && (
                                                        <p className="text-sm font-semibold">
                                                            Dt. Envio:
                                                            <span className=" font-bold ml-1">{rotulo.DATA_ENVIO}</span>
                                                        </p>
                                                    )}
                                                    {rotulo.DATA_FINALIZACAO && (
                                                        <p className="text-sm font-semibold">
                                                            Dt. Finalização:
                                                            <span className=" font-bold ml-1">{rotulo.DATA_FINALIZACAO}</span>
                                                        </p>
                                                    )}
                                                    {rotulo.ABERTOPDI === 'S' && (
                                                        <span className="font-extralight text-[12px] ">* Rótulo aberto pelo PDI</span>
                                                    )}
                                                </CardHeader>
                                            </Card>
                                        ))}

                                </div>
                            </ScrollArea>
                        </div>
                    ))}
                </div>
            </div>

            {modalDetails && <ModalVerDetalhes open={modalDetails} onClose={onClose} idClick={idClick} />}

        </>

    );
};

export default Kanban;
