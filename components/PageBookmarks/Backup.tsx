import styles from './Backup.module.scss';
import Button from '../Button';
import RestoreFileIcon from '@/assets/icons/filled/restore-file.svg?react';
import FileExportIcon from '@/assets/icons/solid/file-export.svg?react';
import type React from 'react';

interface BackupProps {
  title: string;
  generateButtonLabel: string;
  restoreButtonLabel: string;
  onGenerateBackup: () => Promise<void>;
  onRestoreBackup: (dataString: string) => Promise<void>;
}

/**
 * Backup component for exporting and importing bookmarks data
 */
const Backup: React.FC<BackupProps> = ({
  title,
  generateButtonLabel,
  restoreButtonLabel,
  onGenerateBackup,
  onRestoreBackup,
}) => {
  const handleGenerateBackup = async () => {
    await onGenerateBackup();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Let the same file be picked again, e.g. after a failed restore
    event.target.value = '';
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const dataString = fileReader.result as string;
      onRestoreBackup(dataString).catch(error => {
        console.error('Failed to restore backup:', error);
      });
    };
    fileReader.readAsText(file);
  };

  return (
    <div className={styles.backup}>
      <div className={styles.title}>{title}</div>

      <Button
        className={styles.action}
        onClick={handleGenerateBackup}
        theme="blue"
        icon={FileExportIcon}
        label={generateButtonLabel}
      />

      <Button
        className={styles.action}
        onFileChange={handleFileChange}
        theme="blue"
        fileAccept="text/plain"
        icon={RestoreFileIcon}
        label={restoreButtonLabel}
      />
    </div>
  );
};

export default Backup;
