import Image from 'next/image';
import { FormEvent, useState } from 'react';
import appPreviewImg from '../assets/aplicacao-trilha-ignite.svg';
import iconCheckImg from '../assets/icon-check.svg';
import logoImg from '../assets/logo.svg';
import usersAvatarExample from '../assets/users-avatar-example.png';
import { api } from '../lib/axios';

interface HomeProps {
  poolCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const { code } = response.data;

      // Copy code to clipboard
      await navigator.clipboard.writeText(code);

      alert(
        `
        Bolão criado com sucesso! O código foi copiado para a sua área de transferência.
        Code: ${code}
        `
      );

      setPoolTitle('');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW copa logo" quality={100} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre os amigos
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExample} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> Pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
            placeholder="Qual o nome do seu bolão?"
            required
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após você criar seu bolão, você receberá um código unico que poderá
          usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 py-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center  gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center  gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImg} alt="" />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count'),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
