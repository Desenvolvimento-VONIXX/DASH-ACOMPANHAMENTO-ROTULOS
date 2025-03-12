import React from "react";
import Formula from "./Formula";
import LinhaTempo from "./LinhaTempo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useGetDetailsRot } from "@/hooks/getDetails";
import { useGetLinhaTempo } from "@/hooks/getLinhaTempo";
import VerChecklist from "./VerChecklist";

interface Props {
    open: boolean;
    onClose: () => void;
    idClick: number | null;
}

const ModalVerDetalhes: React.FC<Props> = ({ open, onClose, idClick }) => {
    const { data: rotulo } = useGetDetailsRot(idClick);
    const { data: linha_tempo, isError, isLoading } = useGetLinhaTempo(idClick);
    const [openVerChecklist, setOpenVerChecklist] = React.useState<boolean>(false);
    const [idAtividade, setIdAtividade] = React.useState<number | null>(null);

    const onCloseVerChecklist = () => {
        setOpenVerChecklist(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-[50%] max-h-[80vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Processo</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[60vh] overflow-y-auto p-2">
                        <div className="flex flex-col gap-2">
                            {rotulo ? (
                                <div key={rotulo.ID_ROTULO}>
                                    <p className="font-semibold mb-1">
                                        Rótulo: <span className="font-light">{rotulo.CODPROD} - {rotulo.DESCRPROD.trim()}</span>
                                    </p>
                                    <p className="font-semibold mb-1">
                                        Status: <span className="font-light">{rotulo.STATUS2}</span>
                                    </p>
                                    <p className="font-semibold mb-1">
                                        Data de Criação: <span className="font-light">{rotulo.DATA}</span>
                                    </p>

                                    <div className="flex gap-2 mb-5 mt-2">
                                        {rotulo.ABERTOPDI === 'S' && (
                                            <Formula idClick={idClick} />
                                        )}
                                    </div>
                                </div>

                            ) : null}

                        </div>

                        <div className="mt-2 p-2">
                            {isLoading ? (
                                <p>Carregando...</p>
                            ) : isError ? (
                                <p>Ocorreu um erro ao carregar os dados.</p>
                            ) : (
                                <LinhaTempo
                                    idClick={idClick}
                                    linha_tempo={linha_tempo}
                                    setOpenVerChecklist={setOpenVerChecklist}
                                    setIdAtividade={setIdAtividade}
                                />
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog >

            {openVerChecklist &&
                <VerChecklist
                    open={openVerChecklist}
                    onClose={onCloseVerChecklist}
                    idClick={idClick}
                    idAtividade={idAtividade}
                />
            }
        </>
    )
}

export default ModalVerDetalhes;