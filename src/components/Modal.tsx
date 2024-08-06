'use client'
import React, { useEffect } from "react";

import styles from '@/styles/Modal.module.css';

type Props = {
    open: boolean;
    component: React.ReactNode;
    close: Function;
}

const Modal: React.FC<Props> = ({ open, component, close }) => {

    
    useEffect(() => {
        if (open) {
            document.body.style.overflowY = 'hidden';
            return () => {
                document.body.style.overflowY = 'unset'
            }
        }
    }, [open])

    const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();

        const target = e.target as HTMLElement
        if (target && target.className?.includes('modal_wrapper')) {
            close()
        }

    }

    return open ? (
        <div className={styles.modal_wrapper} onClick={(e) => handleClose(e)}>
            <div  className={styles.modal_card}>
                {component}
            </div>
        </div>
    ) : null
}

export default Modal;