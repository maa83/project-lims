
using System;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Lims
{
    public class Cryptography
    {
        private int Seed { get; set; }
        ///Size in bits
        private int SaltSize { get; set; }
        public byte[] Salt { get; private set; }

        public Cryptography() : this( DateTime.Now.Millisecond, 128)
        {
        }

        public Cryptography(int seed, int saltSize)
        {
            Seed = seed;
            SaltSize = saltSize;
        }

        public virtual byte[] Encrypt(string password)
        {
            //128 bit salt. 128/8 bytes
            byte[] salt = new byte[SaltSize/8];
            Random rnd = new Random(Seed);
            rnd.NextBytes(salt);
            this.Salt = salt;

            // derive a 256-bit subkey (use HMACSHA256 with 10,000 iterations)
            KeyDerivationPrf prf = KeyDerivationPrf.HMACSHA256;
            int numBytesRequested = 256/8;
            int iterationCount = 1000;

            return KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: prf,
                iterationCount: iterationCount,
                numBytesRequested: numBytesRequested
            );
        }
    }
}