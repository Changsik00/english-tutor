import React, {useEffect} from 'react';
import NuanceCluster from './NuanceCluster';
import styles from './nuance.module.css';

export default function NuanceModal({cluster, onClose}) {
  useEffect(() => {
    if (!cluster) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [cluster, onClose]);

  if (!cluster) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={cluster.koreanConcept}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <NuanceCluster cluster={cluster} />
      </div>
    </div>
  );
}
